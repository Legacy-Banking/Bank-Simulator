// Predefined list of first names
const firstNames: string[] = ['John', 'Jane', 'Max', 'Emily', 'Andrew', 'Sophia', 'Michael', 'Olivia'];

// Predefined list of last names
const lastNames: string[] = ['Smith', 'Johnson', 'Brown', 'Taylor', 'Anderson', 'White', 'Harris', 'Martin','Thor'];

// Function to pick a random full name (first name + last name)
export function randomNameGenerator(): string {
  const randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  return `${randomFirstName} ${randomLastName}`;
}
