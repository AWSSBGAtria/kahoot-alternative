First install the required packages via npm:

```
npm install @dicebear/core @dicebear/styles --save
```


Then you can create this avatar as follows:

```
import { Style, Avatar } from '@dicebear/core';
import definition from '@dicebear/styles/moods.json' with { type: 'json' };

const style = new Style(definition);
const avatar = new Avatar(style, {
  "animationVariant": {
    "fast": 0,
    "fastest": 1,
    "medium": 1,
    "none": 1,
    "slow": 0,
    "slowest": 0
  },
  "eyesVariant": {
    "angry": 1,
    "bigPupils": 1,
    "calm": 1,
    "closed": 1,
    "happy": 2,
    "lookDown": 1,
    "lookSide": 1,
    "lookUp": 1,
    "pupils": 3,
    "sleepy": 1,
    "small": 1,
    "sparkle": 1,
    "squint": 1,
    "tallPupils": 1,
    "uneven": 1,
    "wink": 2
  },
  "seed": "Darshan"
});

const svg = avatar.toString();
```

See https://www.dicebear.com/how-to-use/js-library/ for more information.
