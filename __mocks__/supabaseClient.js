export const createClient = jest.fn().mockReturnValue({
    from: jest.fn().mockReturnThis(),         // Return `this` for chaining
    select: jest.fn().mockReturnThis(),       // Chain select method
    in: jest.fn().mockReturnThis(),           // Chain in method
    eq: jest.fn().mockResolvedValue({         // Mock eq to return data as a resolved promise
      data: [],                               // Adjust data as needed for your test cases
      error: null,
    }),
    auth: {
      signIn: jest.fn(),
      signOut: jest.fn(),
      getSession: jest.fn().mockResolvedValue({ data: null, error: null }),
    },
  });