// components/Title.js
export default function Title({ children }: { children: React.ReactNode }) {
    return (
      <p className="text-2xl font-semibold md:text-3xl my-2">
        {children}
      </p>
    );
  }