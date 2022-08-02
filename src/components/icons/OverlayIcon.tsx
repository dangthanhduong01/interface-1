import React, { ComponentProps, ReactNode } from 'react'
import { Box, Flex } from 'src/components/layout'

type Props = {
  icon: ReactNode
  overlay: ReactNode
} & Pick<ComponentProps<typeof Box>, 'top' | 'bottom' | 'left' | 'right'>

// For overlaying icons in JSX
export default function OverlayIcon({ icon, overlay, ...props }: Props) {
  return (
    <>
      {icon}
      <Box position="absolute" {...props}>
        {overlay}
      </Box>
    </>
  )
}

// For multiple SVGs overlayed in a row
export function OverlayGroup({ icons, iconSize = 24 }: { icons: ReactNode[]; iconSize?: number }) {
  return (
    <Flex row alignItems="center">
      {icons.map((icon, i) => {
        return (
          // eslint-disable-next-line react-native/no-inline-styles
          <Box key={i} style={{ marginLeft: i === 0 ? 0 : -(iconSize / 1.25) }}>
            {icon}
          </Box>
        )
      })}
    </Flex>
  )
}
