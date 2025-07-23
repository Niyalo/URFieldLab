interface QuoteSectionProps {
  quote: string;
  backgroundImage: string;
  textColor?: string;
}

export default function QuoteSection({
  quote,
  backgroundImage,
  textColor = '#fb923c' // orange-400 default
}: QuoteSectionProps) {
  return (
    <div 
      className="relative py-20 text-white text-center bg-cover bg-center"
      style={{
        backgroundColor: '#f5fafd',
        backgroundImage: `url('${backgroundImage}')`
      }}
    >
      <div className="absolute inset-0 bg-black/80"></div>
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 
          className="text-2xl lg:text-4xl leading-relaxed"
          style={{
            fontFamily: 'Muli, Helvetica, Arial, sans-serif',
            fontWeight: '300'
          }}
        >
          <span style={{ color: textColor }}>
            {quote}
          </span>
        </h2>
      </div>
    </div>
  );
}
