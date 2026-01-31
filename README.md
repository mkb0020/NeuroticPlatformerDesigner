# 🧮 NEUROTIC PLATFORMER DESIGN CALCULATOR

A physics-based level design tool for **2D platformer developers** who want perfectly spaced, symmetrical, and *mathematically valid* platform layouts.

Designed for the neurotic among us who want **consistency, balance, and repeatability** instead of guesswork.

---

## 📐 WHAT IS THIS?

A tool to help you calculate:

* Maximum jump distance
* Maximum jump height
* Safe horizontal platform gaps
* Structured platform layouts across multiple levels and gauntlets

All based on **real jump physics** using:

* Player speed
* Jump force
* Gravity
* Difficulty scaling via multipliers

Output: clean, structured data you can copy directly into your game.

---

## 💥 FEATURES

* Physics-based jump calculations
* Multi-level & multi-gauntlet layout generation
* Consistent platform spacing per level
* Optional ground overlap tuning
* Mobile-friendly UI (browser-based)
* Packaged desktop app (via Tauri)

---

## 🛑 CAVEATS (PLEASE READ)

In a given level, this tool assumes:

* All platforms are the **same length**
* The **horizontal distance** between each platform is the same
* The **number of platforms per gauntlet** is the same
* The **distance between gauntlets** is the same

So if you're neurotic and want everything **symmetrical, evenly spaced, and predictable**, this tool will feel like home.

If you want hand-crafted chaos — this is probably not it.

---

## ⚒️ Output Structure

The calculator outputs a structured object similar to the following.
Values shown here are placeholders for demonstration purposes.

```js
{
  "jumpForce": 99999, // Input jump force × multiplier
  "effectiveSpeed": 99999, // Base speed × multiplier
  "maxJumpDistance": "99999", // effectiveSpeed × (2 × jumpForce) / gravity
  "maxJumpHeight": "99999", // (jumpForce²) / (2 × gravity)
  "levels": [
    {
      "level": 1,
      "gauntletsPerLevel": 99999,
      "platformsPerGauntlet": 99999,
      "platformWidth": 99999,
      "firstGroundEnd": 99999,
      "groundSegmentLength": 99999,
      "overlap": 99999,
      "platformGap": "99999",
      "platformStartToStart": "99999",
      "gauntlets": [
        {
          "gauntletNumber": 99999,
          "gauntletStartX": "99999",
          "gauntletEndX": "99999",
          "gauntletLength": "999990",
          "platforms": [
            {
              "platformNumber": 99999,
              "startX": "99999",
              "endX": "99999",
              "y": "99999"
            }
            // ...additional platforms
          ],
          "nextGroundSegmentStartX": "99999",
          "nextGroundSegmentEndX": "99999"
        }
        // ...additional gauntlets
      ]
    }
    // ...additional levels
  ]
}
```

---

## 💡 How to Use

1. Enter your player physics values
2. Configure level and platform settings
3. Click **DO THE MATHS**
4. Copy the output into your game

Works directly in the browser or as a desktop app.

---

## 🎥 Tutorial Video

A short walkthrough video is included to explain:

* Input values
* Physics assumptions
* How to use the output in a real game

👉 **Tutorial link coming soon**

---


## 📜 License

This project is licensed under the MIT License.
See the `LICENSE` file for details.

---
