import FeaturedCard from './FeaturedCard';

interface FeaturedOutput {
  imageUrl: string;
  title: string;
  description: string;
  linkText: string;
  linkUrl: string;
  linkTextColor?: string;
}

interface FeaturedOutputsProps {
  title: string;
  outputs: FeaturedOutput[];
  themeColor: string;
}

export default function FeaturedOutputs({
  title,
  outputs,
  themeColor
}: FeaturedOutputsProps) {
  // Generate section background color with transparency (from ProjectThemes)
  const generateSectionBgColor = (color: string) => {
    // Convert hex to RGB and add transparency
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    return `rgba(${r}, ${g}, ${b}, 0.133)`; // ~13% opacity (similar to #fbc02d22)
  };

  const sectionBgColor = generateSectionBgColor(themeColor);

  return (
    <div 
      className="py-16"
      style={{
        backgroundColor: sectionBgColor
      }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-gray-900">{title}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {outputs.map((output, index) => (
            <FeaturedCard
              key={index}
              imageUrl={output.imageUrl}
              title={output.title}
              description={output.description}
              linkText={output.linkText}
              linkUrl={output.linkUrl}
              linkTextColor={output.linkTextColor || themeColor}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
