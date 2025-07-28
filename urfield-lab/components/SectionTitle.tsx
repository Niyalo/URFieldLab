export default function SectionTitle({ text }: { text: string }) {
    return (
        <div className="my-12">
            <hr className="mb-8 border-gray-300 dark:border-gray-700" />
            <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 dark:text-gray-200  max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {text}
            </h2>
        </div>
    );
}
