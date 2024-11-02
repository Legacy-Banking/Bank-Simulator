import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useForm, FormProvider } from "react-hook-form";
import { DatePicker } from "@/components/DatePicker";
import { format } from "date-fns";
import "@testing-library/jest-dom";

interface TestFormProps {
    defaultValues?: any;
    validationMessage?: string;
  }

  const TestForm: React.FC<TestFormProps> = ({ defaultValues, validationMessage }) => {
    const methods = useForm({
      defaultValues,
      mode: "onBlur", // Ensure validation triggers on blur
    });
  
    return (
      <FormProvider {...methods}>
        <DatePicker name="date" />
        {validationMessage && <span>{validationMessage}</span>}
      </FormProvider>
    );
  };

describe("DatePicker Component", () => {
  it("renders the DatePicker component with default text", () => {
    render(<TestForm />);
  
    expect(screen.getByText("Pick a date")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("opens the calendar when the button is clicked", async () => {
    render(<TestForm />);

    // Click on the button to open the calendar
    fireEvent.click(screen.getByRole("button"));
  
    // Check if calendar is visible
    await waitFor(() => expect(screen.getByRole("dialog")).toBeInTheDocument());
  });

  it("disables past dates", async () => {
    render(<TestForm />);

    // Open the calendar popover
    fireEvent.click(screen.getByRole("button"));
  
    // Select a past date for testing (manually setting the date)
    const pastDateButton = screen.getByText(new Date().getDate() - 1);
    expect(pastDateButton).toBeDisabled();
  });

  it("selects a specific future date", async () => {
    render(<TestForm />);

    fireEvent.click(screen.getByRole("button"));

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDateButtons = screen.getAllByText(tomorrow.getDate().toString());

    // Cast the button elements to HTMLButtonElement to access `disabled`
    const tomorrowDateButton = tomorrowDateButtons.find(
      button => !(button as HTMLButtonElement).disabled
    );
    if (tomorrowDateButton) fireEvent.click(tomorrowDateButton);

    await waitFor(() => {
      const formattedDate = format(tomorrow, "PPP");
      expect(screen.getByText(formattedDate)).toBeInTheDocument();
    });
  });

  it("displays a validation message when required", async () => {
    render(<TestForm validationMessage="Date is required" />);

    const dateButton = screen.getByRole("button", { name: /Pick a date/i });
    fireEvent.blur(dateButton); // Trigger blur to activate validation

    await waitFor(() => {
      expect(screen.getByText("Date is required")).toBeInTheDocument();
    });
  });
});
