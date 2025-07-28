export default function ListBlock({ items }: { items: string[] }) {
    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <ul className="list-disc list-inside space-y-2 mb-4">
                {items.map((item: string, i: number) => (
                    <li key={i}>{item}</li>
                ))}
            </ul>
        </div>
    );
}
