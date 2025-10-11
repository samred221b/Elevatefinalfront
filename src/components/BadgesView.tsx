import { useHabits } from '@/context/HabitContext'
import { Card, CardContent } from './ui/card'
import { format } from 'date-fns'
import { AVAILABLE_BADGES } from '@/lib/badges'

export function BadgesView() {
  const { badges, habits, categories } = useHabits()

  const getBadgeDetails = (badgeId: string, userBadge?: any) => {
    const badge = AVAILABLE_BADGES.find(b => b.id === badgeId)
    if (!badge) return null

    let subtitle = ''
    if (userBadge?.habitId) {
      const habit = habits.find(h => h.id === userBadge.habitId)
      if (habit) subtitle = `for ${habit.name}`
    } else if (userBadge?.categoryId) {
      const category = categories.find(c => c.id === userBadge.categoryId)
      if (category) subtitle = `in ${category.name}`
    }

    return { ...badge, subtitle }
  }

  const earnedBadges = badges.map(ub => ({
    ...ub,
    details: getBadgeDetails(ub.badgeId, ub)
  })).filter(b => b.details)

  const unearnedBadges = AVAILABLE_BADGES.filter(
    badge => !badges.some(ub => ub.badgeId === badge.id)
  )

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Your Badges ({earnedBadges.length})</h2>
        {earnedBadges.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">
                Complete habits to earn your first badge! 🎯
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {earnedBadges.map((userBadge) => (
              <Card 
                key={`${userBadge.badgeId}-${userBadge.earnedAt}`}
                className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-2 border-yellow-400"
              >
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-6xl mb-3">{userBadge.details?.icon}</div>
                    <h3 className="font-bold text-lg">{userBadge.details?.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {userBadge.details?.description}
                    </p>
                    {userBadge.details?.subtitle && (
                      <p className="text-xs text-muted-foreground mt-1 italic">
                        {userBadge.details.subtitle}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-2">
                      Earned {format(new Date(userBadge.earnedAt), 'MMM d, yyyy')}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Available Badges</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {unearnedBadges.map((badge) => (
            <Card 
              key={badge.id}
              className="opacity-60 hover:opacity-80 transition-opacity"
            >
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-6xl mb-3 grayscale">{badge.icon}</div>
                  <h3 className="font-bold text-lg">{badge.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {badge.description}
                  </p>
                  <div className="mt-3 inline-block px-3 py-1 bg-muted rounded-full text-xs">
                    {badge.type === 'streak' && `${badge.requirement} day streak`}
                    {badge.type === 'category' && `${badge.requirement} habits in a category`}
                    {badge.type === 'total' && `${badge.requirement} total habits`}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
