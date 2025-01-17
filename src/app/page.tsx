import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <h1>Welcome to the Exercises</h1>
      <p>Select an exercise:</p>
      <div>
        <Link href="/exercise1">
          <button>Exercise 1: Normal Range</button>
        </Link>
        <Link href="/exercise2">
          <button>Exercise 2: Fixed Values Range</button>
        </Link>
      </div>
    </div>
  );
}