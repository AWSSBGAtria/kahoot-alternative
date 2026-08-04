import { Style, Avatar } from '@dicebear/core'
import definition from '@dicebear/styles/fun-emoji.json' with { type: 'json' }

const style = new Style(definition as any)

function generateAvatarSvg(seed: string): string {
  const avatar = new Avatar(style, {
    seed,
  } as any)
  return avatar.toString()
}

// Cache generated avatars for performance
const avatarCache = new Map<string, string>()

function getCachedAvatar(seed: string): string {
  if (!avatarCache.has(seed)) {
    avatarCache.set(seed, generateAvatarSvg(seed))
  }
  return avatarCache.get(seed)!
}

export function getAvatarFromName(name: string): { color: string; initials: string } {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
    hash = hash & hash
  }

  const words = name.trim().split(/\s+/)
  const initials = words.length >= 2
    ? (words[0][0] + words[words.length - 1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase()

  // Derive a consistent color from the name for backgrounds
  const colors = [
    '#8b5cf6', '#ec4899', '#f59e0b', '#26c485', '#2196f3',
    '#e6194b', '#ff6b35', '#06b6d4', '#d946ef', '#84cc16',
  ]
  const colorIndex = Math.abs(hash) % colors.length

  return {
    color: colors[colorIndex],
    initials,
  }
}

export function AvatarIcon({ name, size = 32 }: { name: string; size?: number }) {
  const svgMarkup = getCachedAvatar(name)
  return (
    <div
      style={{ width: size, height: size }}
      dangerouslySetInnerHTML={{ __html: svgMarkup }}
      className="rounded-full overflow-hidden"
    />
  )
}
