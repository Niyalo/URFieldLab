export default function Subheading({ text }: { text: string }) {
    return (
        <h3 className="text-2xl font-bold mt-8 mb-4 col-span-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {text}
        </h3>
    );
}
