# JSON Makeover 💅

**JSON Makeover** is a small utility that transforms the output JSON from the **NEUROTIC Level Design Calculator** into clean, engine-ready level files.

It isolates **ground segments** and **platforms**, splits them **per level**, and generates a **separate downloadable JSON file for each level**



---

## 💥 What It Does

Given the raw json file from **NEUROTIC Level Design Calculator**, JSON Makeover:

- Parses all levels from the source JSON
- Extracts:
  - Ground segments
  - Platform positions and dimensions
- Converts them into a simplified format ideal for game engines
- Outputs **one JSON file per level**
- Provides a **Download button** for each generated file

---

## 📑 Input Format

JSON Makeover expects the standard output from the **Neurotic Level Design Calculator**



**🗃️ For a full example of input and output files, please see MAKEOVER-EXAMPLE-INPUT.json, MAKEOVER-EXAMPLE-OUTPUT-L1.json, and MAKEOVER-EXAMPLE-OUTPUT-L1.json**   

- Example (simplified):

```json
{
  "levels": [
    {
      "level": 1,
      "platformWidth": 250,
      "gauntlets": [
        {
          "platforms": [
            { "startX": "1400.00", "y": "436.0" }
          ],
          "nextGroundSegmentStartX": "4550.00"
        }
      ]
    }
  ]
}
```
## 📤 Output Format

Each level generates its own JSON file with this structure:
```json 
{
  "GroundSegments": [
    { "x": 4550, "y": 440, "width": 1500, "height": 50 }
  ],
  "platforms": [
    { "x": 1400, "y": 436.0, "w": 250, "h": 20 }
  ]
}

```


## 🛠️ Usage

- Load the json output from the calculator into JSON Makeover
- Click **"CONVERT"**
- Download the reformatted json files


## 📜 License

MIT — use it, fork it, remix it, ship it.
See LICENSE
 for details.

