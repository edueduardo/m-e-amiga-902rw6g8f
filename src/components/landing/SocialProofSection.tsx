export const SocialProofSection = () => {
  const stats = [
    { value: '92%', label: 'das usuárias relatam sentir-se mais acolhidas' },
    { value: '10k+', label: 'mulheres já fazem parte da nossa comunidade' },
    { value: '24/7', label: 'de apoio emocional incondicional' },
  ]

  return (
    <section className="w-full py-12 md:py-16 lg:py-20 bg-background">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
          <h2 className="text-2xl font-semibold tracking-tighter text-muted-foreground">
            Junte-se a milhares de mulheres que encontraram seu espaço de
            acolhimento
          </h2>
        </div>
        <div className="divide-y rounded-lg border md:divide-y-0 md:divide-x md:grid md:grid-cols-3">
          {stats.map((stat, index) => (
            <div key={index} className="p-6 text-center">
              <p className="text-4xl font-bold tracking-tighter text-primary sm:text-5xl">
                {stat.value}
              </p>
              <p className="mt-1 text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
