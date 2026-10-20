#!/usr/bin/env python3
"""File de production et transfert reprenable, sans appel API ni generation locale."""
import base64, collections, datetime, fcntl, hashlib, json, os, pathlib, select, struct, sys, zlib

REPO = pathlib.Path(__file__).resolve().parents[1]
ROOT = REPO / "docs/images-configurateur"
REG = ROOT / "suivi-serie.json"

def save(path, value):
    temp = path.with_name(path.name + ".tmp")
    temp.write_text(json.dumps(value, ensure_ascii=True, indent=2) + "\n")
    os.replace(temp, path)

def png(data):
    assert data[:8] == b"\x89PNG\r\n\x1a\n", "signature PNG"
    pos, raw, dims, kind = 8, [], None, None
    while pos + 12 <= len(data):
        n = struct.unpack(">I", data[pos:pos+4])[0]
        kind, chunk = data[pos+4:pos+8], data[pos+8:pos+8+n]
        end = pos + n + 12
        assert end <= len(data), "chunk incomplet"
        assert zlib.crc32(kind+chunk) & 0xffffffff == struct.unpack(">I", data[pos+8+n:end])[0], "CRC"
        if kind == b"IHDR":
            dims = list(struct.unpack(">II", chunk[:8]))
            bit, color = chunk[8:10]
            assert chunk[12] == 0, "PNG entrelace non gere"
        if kind == b"IDAT":
            raw.append(chunk)
        pos = end
        if kind == b"IEND":
            break
    assert kind == b"IEND" and pos == len(data), "fin PNG"
    channels = {0:1, 2:3, 3:1, 4:2, 6:4}[color]
    assert len(zlib.decompress(b"".join(raw))) == (1+(dims[0]*channels*bit+7)//8)*dims[1], "pixels"
    return dims

def status():
    s = json.loads(REG.read_text())
    complete = sum(v["statut"] == "archive-documente" for m in s["modeles"] for v in m["variantes"])
    todo = [(m, v) for m in sorted(s["modeles"], key=lambda x:x["ordre"]) for v in m["variantes"] if v["statut"] != "archive-documente"]
    return s, complete, todo

def archive(req, path, data):
    dims = png(data)
    s, _, _ = status()
    m = next(x for x in s["modeles"] if x["modeleId"] == req["modeleId"])
    v = next(x for x in m["variantes"] if x["matiereId"] == req["matiereId"])
    assert path == (ROOT/m["dossier"]/v["fichier"]).resolve(), "destination inconnue"
    old_part = path.with_suffix(".png.part")
    if old_part.exists():
        retired = ROOT/"transferts-interrompus"
        retired.mkdir(exist_ok=True)
        target = retired/(path.stem+"-"+hashlib.sha256(old_part.read_bytes()).hexdigest()[:12]+".png.part")
        assert not target.exists() or target.read_bytes() == old_part.read_bytes()
        if not target.exists():
            os.replace(old_part, target)
        else:
            old_part.unlink()
    now = datetime.datetime.now(datetime.timezone.utc).isoformat()
    v.update(statut="archive-documente", sha256=req["sha256"], dimensionsPx=dims,
             tailleOctets=len(data), integritePngVerifiee=True, validationConfigurateur=False)
    v.pop("transfertPartiel", None)
    manifest_path = path.parent/"manifest.json"
    mf = json.loads(manifest_path.read_text()) if manifest_path.exists() else {
        "modeleId":m["modeleId"], "referenceInterne":m["referenceInterne"], "famille":m["famille"],
        "sourceLibraryId":m["sourceLibraryId"], "nomPublic":None, "version":1, "variantes":[],
        "statut":"pilote-a-valider", "vuesParVariante":1, "calibration":None, "contoursPixelValides":False}
    entry = next((x for x in mf["variantes"] if x["matiereId"] == v["matiereId"]), None)
    if entry is None:
        entry = {"matiereId":v["matiereId"], "image":v["fichier"],
                 "textureSelecteur":"../../../../matieres/2026-10-19/textures-v1/"+v["matiereId"]+"-texture-v1.png"}
        mf["variantes"].append(entry)
    entry.update({k:v[k] for k in ("sha256","dimensionsPx","tailleOctets","integritePngVerifiee")})
    mf.update(variantesPresentes=len(mf["variantes"]), variantesCibles=10, dernierControleIntegrite=now,
              dimensionsPx=dims, conformeResolutionFinale=min(dims)>=1600, validationConfigurateur=False)
    save(manifest_path, mf)
    pp = path.parent/"prompts-exacts.json"
    prompts = json.loads(pp.read_text()) if pp.exists() else {"mode":"imagegen-integre","variantes":{}}
    prompts["variantes"][v["matiereId"]] = {"prompt":req["prompt"],"date":now,
        "sourceLocale":req.get("sourceLocale"),"sha256":req["sha256"],
        "references":req.get("references",[]),"controleVisuel":req.get("controleVisuel")}
    save(pp, prompts)
    count = sum(x["statut"]=="archive-documente" for a in s["modeles"] for x in a["variantes"])
    s["misAJour"] = now[:10]
    s["bilanVerifie"] = {"dateControle":now,"imagesCompletes":count,"combinaisonsRestantes":s["cible"]-count,
                        "imagesValideesConfigurateur":0,"controle":"archive par image, PNG et SHA256"}
    pending = [(a,x) for a in sorted(s["modeles"],key=lambda a:a["ordre"]) for x in a["variantes"] if x["statut"]!="archive-documente"]
    s["prochaineAction"] = {"modeleId":pending[0][0]["modeleId"],"matiereId":pending[0][1]["matiereId"],"action":"Produire depuis la base Bengal puis archiver avant la variante suivante."} if pending else {"action":"Serie complete, validation finale separee."}
    save(REG,s)
    readme = path.parent/"README.md"
    if not readme.exists():
        readme.write_text("# "+m["referenceInterne"]+" - pilote v1\n\nSource : "+m["sourceLibraryId"]+".\n"+m["notes"]+"\n\nUne vue par matiere ; nom public et calibration non valides.\n")
    content = readme.read_text().split("\n<!-- production-live -->")[0]
    names = [x["matiereId"] for x in mf["variantes"]]
    readme.write_text(content+"\n<!-- production-live -->\n\nEtat courant : "+str(len(names))+"/10 variantes.\nPresentes : "+", ".join(names)+".\nVoir manifest.json pour dimensions et SHA256 ; prompts-exacts.json pour les nouveaux appels.\n")
    with (ROOT/"journal-production.jsonl").open("a") as f:
        f.write(json.dumps({"date":now,"modeleId":m["modeleId"],"matiereId":v["matiereId"],"sha256":req["sha256"],"total":count},ensure_ascii=True)+"\n")
    return {"ok":True,"archive":str(path),"imagesCompletes":count,"prochaineAction":s["prochaineAction"]}

def receive(req):
    path = (ROOT/req["destination"]).resolve()
    assert path.is_relative_to(ROOT.resolve()) and path.suffix == ".png", "chemin interdit"
    path.parent.mkdir(parents=True, exist_ok=True)
    part = path.with_name(path.name+"."+req["sha256"][:12]+".incoming.part")
    metadata = part.with_suffix(".json")
    save(metadata, {k:v for k,v in req.items() if k!="data"})
    chunk = base64.b64decode(req["data"], validate=True)
    offset = req["offset"]
    assert 0 <= offset <= req["total"] and offset+len(chunk) <= req["total"], "offset invalide"
    if path.exists():
        data = path.read_bytes()
        assert hashlib.sha256(data).hexdigest() == req["sha256"], "fichier complet protege"
        return archive(req,path,data)
    if not part.exists():
        part.touch()
    size = part.stat().st_size
    with part.open("r+b") as f:
        assert size >= offset, "trou de transfert"
        if size > offset:
            f.seek(offset)
            assert f.read(len(chunk)) == chunk, "reprise incompatible"
        else:
            f.seek(offset); f.write(chunk); f.flush(); os.fsync(f.fileno())
    size = part.stat().st_size
    if size == req["total"]:
        data = part.read_bytes()
        assert hashlib.sha256(data).hexdigest() == req["sha256"], "SHA256 final"
        png(data)
        os.replace(part,path)
        result = archive(req,path,data)
        metadata.unlink(missing_ok=True)
        return result
    return {"ok":True,"offset":size,"total":req["total"]}

def main():
    if len(sys.argv)>1 and sys.argv[1]=="serve":
        with (ROOT/".production.lock").open("a+") as lock:
            try:
                fcntl.flock(lock,fcntl.LOCK_EX|fcntl.LOCK_NB)
            except BlockingIOError:
                print(json.dumps({"ok":False,"busy":True}),flush=True); return
            print(json.dumps({"ok":True,"ready":True,"idleTimeoutSeconds":1800}),flush=True)
            while select.select([sys.stdin],[],[],1800)[0]:
                line=sys.stdin.readline()
                if not line: break
                try:
                    req=json.loads(line)
                    if req.get("action")=="stop":
                        print(json.dumps({"ok":True,"stopped":True}),flush=True); break
                    if req.get("action")=="ping": result={"ok":True,"pong":True}
                    else: result=receive(req)
                except Exception as e:
                    result={"ok":False,"error":type(e).__name__+": "+str(e)}
                print(json.dumps(result,ensure_ascii=True),flush=True)
    else:
        s,n,todo=status()
        print(json.dumps({"imagesCompletes":n,"cible":s["cible"],"restantes":len(todo),
            "prochaines":[{"modeleId":m["modeleId"],"matiereId":v["matiereId"],
                "dossier":m["dossier"],"fichier":v["fichier"],"sourceLibraryId":m["sourceLibraryId"]}
                for m,v in todo[:10]]},ensure_ascii=True))

if __name__=="__main__":
    main()
