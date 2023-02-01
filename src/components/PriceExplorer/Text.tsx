import React from 'react'
import { useAnimatedStyle, useDerivedValue } from 'react-native-reanimated'
import { useLineChartDatetime } from 'react-native-wagmi-charts'
import { useAppTheme } from 'src/app/hooks'
import { Flex } from 'src/components/layout'
import { Text } from 'src/components/Text'
import { AnimatedText } from 'src/components/text/AnimatedText'
import { useLineChartPrice, useLineChartRelativeChange } from './usePrice'

export function PriceText({
  loading,
  spotPrice,
}: {
  loading: boolean
  spotPrice?: number
}): JSX.Element {
  const price = useLineChartPrice({ spotPrice })

  if (loading) {
    return <Text loading loadingPlaceholderText="$10,000" variant="headlineLarge" />
  }

  return (
    <AnimatedText
      color="textPrimary"
      testID="price-text"
      text={price.formatted}
      variant="headlineLarge"
    />
  )
}

export function RelativeChangeText({
  loading,
  spotRelativeChange,
}: {
  loading: boolean
  spotRelativeChange?: number
}): JSX.Element {
  const theme = useAppTheme()

  const relativeChange = useLineChartRelativeChange({ spotRelativeChange })
  const icon = useDerivedValue(() => (relativeChange.value.value > 0 ? '↗' : '↘'))
  const styles = useAnimatedStyle(() => ({
    color:
      relativeChange.value.value > 0 ? theme.colors.accentSuccess : theme.colors.accentCritical,
  }))

  if (loading) {
    return <Text loading loadingPlaceholderText="00.00%" variant="bodyLarge" />
  }

  return (
    <Flex row gap="xxxs">
      <AnimatedText style={styles} testID="relative-change-icon" text={icon} variant="bodyLarge" />
      <AnimatedText
        style={styles}
        testID="relative-change-text"
        text={relativeChange.formatted}
        variant="bodyLarge"
      />
    </Flex>
  )
}

export function DatetimeText({ loading }: { loading: boolean }): JSX.Element | null {
  // `datetime` when scrubbing the chart
  const datetime = useLineChartDatetime()

  if (loading) return null

  return <AnimatedText color="textSecondary" text={datetime.formatted} variant="bodyLarge" />
}
