import { Github } from "lucide-react";

export default function About() {
  return (
    <>
      <div className="mb-10">
        <h1 className="ml-9 mt-9 font-bold text-[20px]">About us</h1>
        <div className="ml-10 mt-5">
          <p className="text-gray-700 mb-4">
            Welcome to our Stock Management System. Our platform helps
            businesses track their products, manage categories, and monitor
            sales in an easy and efficient way.
          </p>
          <div className="mt-6">
            <div className="flex gap-1.5">
              <Github />
              <a
                href="https://github.com/ahmad206abdelkader"
                className="text-gray-800"
              >
                ahmad206abdelkader
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
