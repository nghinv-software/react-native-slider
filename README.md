# @nghinv/react-native-slider

React Native Slider Library use reanimated 2

---

[![CircleCI](https://circleci.com/gh/nghinv-software/react-native-slider.svg?style=svg)](https://circleci.com/gh/nghinv-software/react-native-slider)
[![Version][version-badge]][package]
[![MIT License][license-badge]][license]
[![All Contributors][all-contributors-badge]][all-contributors]
[![PRs Welcome][prs-welcome-badge]][prs-welcome]

<p align="center">
<img src="./assets/demo.gif" width="300"/>
</p>

## Installation

```sh
yarn add @nghinv/react-native-slider
```

or 

```sh
npm install @nghinv/react-native-slider
```

- peerDependencies

```sh
yarn add react-native-gesture-handler react-native-reanimated @nghinv/react-native-animated
```

## Usage

```js
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Slider from '@nghinv/react-native-slider';

function App() {
  const [value, setValue] = useState(0);

  const onChange = useCallback((v) => {
    setValue(v);
  }, []);

  const onConfirm = useCallback((v) => {
    setValue(v);
  }, []);

  return (
    <View style={styles.container}>
      <Slider
        min={1}
        max={50}
        step={1}
        width={240}
        value={value}
        onChange={onChange}
        onConfirm={onConfirm}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
});

export default App;
```

# Property

| Property | Type | Default | Description |
|----------|:----:|:-------:|-------------|
| min | `number` | `0` |  |
| max | `number` | `100` |  |
| step | `number` | `1` |  |
| value | `number` | `0` |  |
| animatedValue | `Animated.SharedValue<number>` | `undefined` |  |
| width | `number \| string` | `undefined` |  |
| style | `ViewStyle` | `undefined` |  |
| thumbRadius | `number` | `4` |  |
| trackSize | `number` | `2` |  |
| thumbTintColor | `string` | `white` |  |
| lowerTrackColor | `string` | `#448aff` |  |
| upperTrackColor | `string` | `#616161` |  |
| onStart | `() => void` | `undefined` |  |
| onChange | `(value: number) => void` | `undefined` |  |
| onConfirm | `(value: number) => void` | `undefined` |  |
| disabled | `boolean` | `false` |  |
| touchScale | `number` | `1.6` |  |
| hitSlop | `number` | `16` |  |
| hapticFeedback | `boolean` | `false` |  |


---
## Credits

- [@Nghi-NV](https://github.com/Nghi-NV)

[version-badge]: https://img.shields.io/npm/v/@nghinv/react-native-slider.svg?style=flat-square
[package]: https://www.npmjs.com/package/@nghinv/react-native-slider
[license-badge]: https://img.shields.io/npm/l/@nghinv/react-native-slider.svg?style=flat-square
[license]: https://opensource.org/licenses/MIT
[all-contributors-badge]: https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square
[all-contributors]: #contributors
[prs-welcome-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square
[prs-welcome]: http://makeapullrequest.com
