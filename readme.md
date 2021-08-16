# adbssi

[ADB](#) [s](#)hell [s](#)creencap [i](#)nterface

![carbon](carbon.png)

### Install

```bash
npm install -g adbssi
```

### Usage

```bash
adbssi screenshot.png
```

### Module

```js
import ADBssi from "adbssi"

/* valid ext
    .png | .jpg | .gif
*/
const filename = "screenshot.png"

/* valid type
    usb | tcp | auto
*/
const connectionType = "usb"

ADBssi(filename, connectionType)
    .then((savedFilePath) => {
        /*  savedFilePath */
    })
    .catch((errorTag) => {
        /* errorTag */
    })
```

#### Requirement

-   [adb](https://adbdriver.com/downloads/) (connected to device)
-   [node](https://nodejs.org/en/download/) (version >=14)

---

[Android Debug Bridge](https://developer.android.com/studio/command-line/adb/) | [Screencap](https://developer.android.com/studio/command-line/adb#screencap)
