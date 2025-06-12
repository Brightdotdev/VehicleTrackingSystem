import React, { useState } from "react";
import { DateTimePicker } from "@/components/ui/DateTimePicker";
import { format } from "date-fns";

export default function MyForm() {
  const [date, setDate] = useState<Date | undefined>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const localDateTimeString = date
      ? format(date, "yyyy-MM-dd'T'HH:mm:ss")
      : "";
    // Send localDateTimeString to your Java backend
    console.log("Java LocalDateTime:", localDateTimeString);
    // ...submit to backend
  };

  return (
    <form onSubmit={handleSubmit}>
      <DateTimePicker value={date} onChange={setDate} />
      <button type="submit">Submit</button>
    </form>
  );
}

