# Alphalight

An early browser light experiment with a white-to-amber slider and requested
10 Hz or 40 Hz playback. It is static HTML, CSS, and JavaScript with no backend.

**[Open the demo](https://rustybladerunner.github.io/alphalight/).** It starts still.

> **Flashing-light warning:** Do not use this experiment if you have epilepsy or
> sensitivity to flickering light. Stop immediately if you feel unwell. This is
> not a medical device or treatment. We have not established a health benefit.

## Use

1. Read the warning and select a requested frequency.
2. Adjust the warmth and acknowledge the warning.
3. Press **Start** only when you intend to begin playback.
4. Press **Stop** or **Escape** to stop.

Changing frequency, leaving the tab, or withdrawing acknowledgement stops
playback. Returning to the tab does not restart it. A reduced-motion preference
disables playback. These controls do not make flashing light safe for everyone.

## Limits

The rates describe the JavaScript timer request, not calibrated screen output.
Display refresh rate, browser scheduling, and hardware affect the visible result.
The old Alpha/Gamma labels did not establish an effect on brain activity.

## Run and check

Open `index.html` locally, or serve this directory with a static server. No build
or package installation is needed. With Node.js 20 or later, run the control
regressions before publishing:

```sh
node --test tests/controls.test.cjs
```

The tests check idle startup, explicit start, stop, Escape, tab visibility,
frequency changes, acknowledgement, and reduced motion with simulated timers.
They do not measure physical display frequency. Check the actual page after UI
changes, including its initial stopped state and keyboard controls.

## License

MIT — see [LICENSE](LICENSE).
