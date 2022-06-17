import React, { ComponentProps, PropsWithChildren, ReactNode } from 'react'
import { FlatList, FlatListProps } from 'react-native'
import { useAppTheme } from 'src/app/hooks'
import ArrowDown from 'src/assets/icons/arrow-down.svg'
import { Button } from 'src/components/buttons/Button'
import { PrimaryButton } from 'src/components/buttons/PrimaryButton'
import { Box, Flex } from 'src/components/layout'
import { Text } from 'src/components/Text'
import { Trace } from 'src/features/telemetry/Trace'

// Container
export function Container({ children, ...trace }: PropsWithChildren<ComponentProps<typeof Trace>>) {
  return (
    <Trace {...trace}>
      <Box bg="neutralBackground" borderRadius="md" pb="md">
        {children}
      </Box>
    </Trace>
  )
}

// Header
interface HeaderProps {
  title: string | ReactNode
  subtitle?: string | ReactNode
  onPress?: () => void
}

function Header({ title, subtitle, onPress }: HeaderProps) {
  const theme = useAppTheme()

  return (
    <Button
      borderBottomColor="neutralOutline"
      borderBottomWidth={0.5}
      px="md"
      py="sm"
      onPress={onPress}>
      <Flex row alignItems="center" justifyContent="space-between">
        <Flex gap="xxs">
          {typeof title === 'string' ? (
            <Text color="neutralTextSecondary" variant="body1">
              {title}
            </Text>
          ) : (
            title
          )}
          {subtitle ? (
            typeof subtitle === 'string' ? (
              <Text variant="subHead1">{subtitle}</Text>
            ) : (
              subtitle
            )
          ) : null}
        </Flex>
        <ArrowDown
          color={theme.colors.neutralTextSecondary}
          height={24}
          strokeWidth={2}
          style={{ transform: [{ rotate: '270deg' }] }}
          width={24}
        />
      </Flex>
    </Button>
  )
}

// Empty State
interface EmptyStateProps {
  buttonLabel: string
  description: string
  onPress: () => void
  title: string
}

function EmptyState({ buttonLabel, description, onPress, title }: EmptyStateProps) {
  return (
    <Flex centered gap="sm" p="sm">
      <Text fontWeight="600" textAlign="center" variant="subHead1">
        {title}
      </Text>
      <Text color="neutralTextSecondary" textAlign="center" variant="caption">
        {description}
      </Text>
      <PrimaryButton label={buttonLabel} textVariant="body1" variant="blue" onPress={onPress} />
    </Flex>
  )
}

// List
type ListProps = FlatListProps<any>

function List(props: ListProps) {
  return (
    <FlatList
      {...props}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
    />
  )
}

export const Section = {
  Container,
  EmptyState,
  Header,
  List,
}
