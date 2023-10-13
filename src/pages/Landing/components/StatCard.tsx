import { motion } from 'framer-motion'
import styled from 'styled-components'

import { H3 } from './Generics'

type StatCardProps = {
  title: string
  value: string
  prefix?: string
  suffix?: string
  delay?: number
  inView?: boolean
}

function rotateArray<T>(arr: T[], n: number) {
  return arr.slice(n, arr.length).concat(arr.slice(0, n))
}

const numeric = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
const currency = ['¥', '£', '€', '$']
const suffixes = [' ', 'K', 'M', 'B', 'T']
const delineators = [',', '.']

export function StatCard(props: StatCardProps) {
  return (
    <Container>
      <Title>{props.title}</Title>
      <StringInterpolationWithMotion
        prefix={props.prefix}
        suffix={props.suffix}
        value={props.value}
        delay={props.delay}
        inView={props.inView}
      />
    </Container>
  )
}

// @ts-ignore
function StringInterpolationWithMotion({ prefix, suffix, value, delay, inView }) {
  const chars = value.split('')

  return (
    <Mask
      initial="initial"
      animate={inView ? 'animate' : 'initial'}
      // whileInView="animate"
      transition={{ staggerChildren: 0.025, delayChildren: delay }}
      // viewport={{ once: true }}
    >
      {chars.map((char: string, index: number) => {
        // select charset based on char
        const charset = numeric.includes(char)
          ? numeric
          : delineators.includes(char)
          ? delineators
          : currency.includes(char)
          ? currency
          : suffixes

        return <NumberSprite char={char} key={index} charset={charset} />
      })}

      <TopGradient />
      <BottomGradient />
    </Mask>
  )
}

// @ts-ignore
function NumberSprite({ char, charset }: { char: string; charset: string[] }) {
  const height = 60

  // rotate array so that the char is at the top
  const chars = rotateArray(charset, charset.indexOf(char))

  const idx = chars.indexOf(char)

  const variants = {
    initial: {
      y: idx + 3 * -height,
    },
    animate: {
      y: idx * -height,
      transition: {
        duration: 1,
        type: 'spring',
      },
    },
  }

  return (
    <SpriteContainer variants={variants}>
      {chars.map((char, index) => {
        const charVariants = {
          initial: {
            opacity: 0.25,
          },
          animate: {
            opacity: idx === index ? 1 : 0,
            transition: {
              opacity: {
                duration: 0.5,
              },
              duration: 1,
              type: 'spring',
            },
          },
        }

        return (
          <Char variants={charVariants} key={index}>
            {char}
          </Char>
        )
      })}
    </SpriteContainer>
  )
}

const TopGradient = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 28px;
  width: 100%;
  background: linear-gradient(180deg, ${({ theme }) => theme.surface2} 20%, rgba(0, 0, 0, 0) 100%);
`

const BottomGradient = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 28px;
  width: 100%;
  background: linear-gradient(0deg, ${({ theme }) => theme.surface2} 20%, rgba(0, 0, 0, 0) 100%);
`

const Mask = motion(styled.span`
  position: relative;
  padding-top: 28px;
  padding-bottom: 28px;
  display: flex;
  height: 116px;
  max-height: 180px;
  width: 100%;
  overflow: hidden;
  @media (max-width: 768px) {
    padding-top: 16px;
    padding-bottom: 16px;
    height: 92px;
  }
`)

const Char = motion(styled.div`
  font-variant-numeric: lining-nums tabular-nums;
  font-family: Basel;
  font-size: 52px;
  font-style: normal;
  font-weight: 500;
  color: ${({ theme }) => theme.neutral1};
  line-height: 32px; /* 115.385% */
  @media (max-width: 768px) {
    font-size: 24px;
  }
`)

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  position: relative;
  border-radius: 20px;
  padding-left: 32px;
  padding-right: 32px;
  padding-top: 28px;
  padding-bottom: 0;
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.surface2};
  overflow: hidden;
  @media (max-width: 768px) {
    padding: 16px;
    padding-bottom: 0px;
  }
`

const SpriteContainer = motion(styled.div`
  pointer-events: none;
  diplay: flex;
  flex-direction: column;
  color: ${({ theme }) => theme.neutral2};
`)

const Title = styled(H3)`
  color: ${({ theme }) => theme.neutral2};
  @media (max-width: 768px) {
    font-size: 16px;
    line-height: 24px;
  }
`