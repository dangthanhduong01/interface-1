import React, { useEffect, useState } from 'react'
import { StyleSheet } from 'react-native'
import Animated, {
  FadeIn,
  FadeOut,
  Layout,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated'
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg'
import { useAppTheme } from 'src/app/hooks'
import { Flex } from 'src/components/layout'
import { Theme } from 'ui/src/theme/restyle'
import { usePrevious } from 'utilities/src/react/hooks'

const NUMBER_ARRAY = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
const NUMBER_WIDTH_ARRAY = [30, 22, 30, 30, 30, 30, 30, 30, 30, 30] // width of digits in a font
const DIGIT_HEIGHT = 60
const ADDITIONAL_WIDTH_FOR_ANIMATIONS = 10

const RollNumber = ({
  digit,
  nextColor,
  index,
  chars,
  theme,
  commonPrefixLength,
}: {
  chars: string[]
  digit?: string
  nextColor?: string
  index: number
  theme: Theme
  commonPrefixLength: number
}): JSX.Element => {
  const fontColor = useSharedValue(
    nextColor || (index > chars.length - 4 ? theme.colors.neutral3 : theme.colors.neutral1)
  )
  const yOffset = useSharedValue(digit && Number(digit) >= 0 ? DIGIT_HEIGHT * -digit : 0)

  useEffect(() => {
    const finishColor = index > chars.length - 4 ? theme.colors.neutral3 : theme.colors.neutral1
    if (nextColor && index > commonPrefixLength - 1) {
      fontColor.value = withSequence(
        withTiming(nextColor, { duration: 250 }),
        withDelay(50, withTiming(finishColor, { duration: 300 }))
      )
    } else {
      fontColor.value = finishColor
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [digit, nextColor, theme])

  const animatedFontStyle = useAnimatedStyle(() => {
    return {
      color: fontColor.value,
    }
  })

  const numbers = NUMBER_ARRAY.map((char) => {
    return (
      <Animated.Text
        style={[animatedFontStyle, AnimatedFontStyles.fontStyle, { height: DIGIT_HEIGHT }]}>
        {char}
      </Animated.Text>
    )
  })

  useEffect(() => {
    if (digit && Number(digit) >= 0) {
      yOffset.value = withTiming(DIGIT_HEIGHT * -digit)
    }
  })

  const animatedWrapperStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: yOffset.value }],
    }
  })

  if (digit && Number(digit) >= 0) {
    return (
      <Animated.View
        style={[
          animatedWrapperStyle,
          {
            width: (NUMBER_WIDTH_ARRAY[Number(digit)] || 0) + ADDITIONAL_WIDTH_FOR_ANIMATIONS,
            marginRight: -ADDITIONAL_WIDTH_FOR_ANIMATIONS,
          },
        ]}>
        {numbers}
      </Animated.View>
    )
  } else {
    return (
      <Animated.Text
        style={[animatedFontStyle, AnimatedFontStyles.fontStyle, { height: DIGIT_HEIGHT }]}>
        {digit}
      </Animated.Text>
    )
  }
}

const Char = ({
  index,
  chars,
  nextColor,
  commonPrefixLength,
  theme,
}: {
  index: number
  chars: string[]
  nextColor?: string
  commonPrefixLength: number
  theme: Theme
}): JSX.Element => {
  return (
    <Animated.View
      entering={nextColor ? FadeIn : undefined}
      exiting={FadeOut}
      layout={Layout}
      style={[{ height: DIGIT_HEIGHT }, AnimatedCharStyles.wrapperStyle]}>
      <RollNumber
        chars={chars}
        commonPrefixLength={commonPrefixLength}
        digit={chars[index]}
        index={index}
        nextColor={nextColor}
        theme={theme}
      />
    </Animated.View>
  )
}

function longestCommonPrefix(a: string, b: string): string {
  let i = 0
  while (a[i] && b[i] && a[i] === b[i]) {
    i++
  }
  return a.substr(0, i)
}

const AnimatedNumber = ({
  isLoading,
  value,
  colorIndicationDuration,
}: {
  isLoading: boolean
  value?: string
  colorIndicationDuration: number
}): JSX.Element => {
  const prevValue = usePrevious(value)
  const [chars, setChars] = useState<string[]>()
  const [commonPrefixLength, setCommonPrefixLength] = useState<number>(0)
  const [nextColor, setNextColor] = useState<string>()

  const theme = useAppTheme()

  useEffect(() => {
    if (value && prevValue !== value) {
      if (prevValue && value > prevValue) {
        setNextColor(theme.colors.statusSuccess)
      } else if (prevValue && value < prevValue) {
        setNextColor(theme.colors.neutral2)
      } else {
        setNextColor(undefined)
      }
      const newChars = value.split('')
      setChars(newChars)
      setCommonPrefixLength(longestCommonPrefix(prevValue ?? '', value).length)
      setTimeout(() => {
        setNextColor(undefined)
      }, colorIndicationDuration)
    }
  }, [
    colorIndicationDuration,
    prevValue,
    theme.colors.neutral2,
    theme.colors.statusCritical,
    theme.colors.statusSuccess,
    value,
  ])

  return (
    <Flex alignItems="flex-start" flexDirection="row" gap="none">
      {isLoading || (
        <Svg height={DIGIT_HEIGHT} style={AnimatedNumberStyles.gradientStyle} width="100%">
          <Defs>
            <LinearGradient id="backgroundTop" x1="0%" x2="0%" y1="15%" y2="0%">
              <Stop offset="0" stopColor={theme.colors.surface1} stopOpacity="0" />
              <Stop offset="1" stopColor={theme.colors.surface1} stopOpacity="1" />
            </LinearGradient>
            <LinearGradient id="background" x1="0%" x2="0%" y1="85%" y2="100%">
              <Stop offset="0" stopColor={theme.colors.surface1} stopOpacity="0" />
              <Stop offset="1" stopColor={theme.colors.surface1} stopOpacity="1" />
            </LinearGradient>
          </Defs>
          <Rect
            fill="url(#backgroundTop)"
            height={DIGIT_HEIGHT}
            opacity={1}
            width="100%"
            x="0"
            y="0"
          />
          <Rect
            fill="url(#background)"
            height={DIGIT_HEIGHT}
            opacity={1}
            width="100%"
            x="0"
            y="0"
          />
        </Svg>
      )}
      {chars &&
        chars.map((_, index) => (
          <Char
            key={
              index === 0 ? `$_sign_${theme.colors.neutral1}` : `$_number_${chars.length - index}`
            }
            chars={chars}
            commonPrefixLength={commonPrefixLength}
            index={index}
            nextColor={nextColor}
            theme={theme}
          />
        ))}
    </Flex>
  )
}

export default AnimatedNumber

const AnimatedNumberStyles = StyleSheet.create({
  gradientStyle: {
    position: 'absolute',
    zIndex: 100,
  },
})

const AnimatedCharStyles = StyleSheet.create({
  wrapperStyle: {
    overflow: 'hidden',
  },
})

const AnimatedFontStyles = StyleSheet.create({
  fontStyle: {
    fontSize: 48,
    fontWeight: '600',
  },
})