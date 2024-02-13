import React, { useState, ChangeEvent, FormEvent } from 'react';

interface FormProps {
  onSubmit: (value: string) => void;
}

const Form: React.FC<FormProps> = ({ onSubmit }) => {
  const [inputValue, setInputValue] = useState<string>('');

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // You can perform any action with the input value here (e.g., send it to a server, perform validation, etc.)
    onSubmit(inputValue)
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label style={{ display: 'block'}}>
          Paste in an address to find how long until it can claim sLYX...
        </label>
        <div className="input-container">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            pattern="^0[Xx][0-9a-fA-F]{40}$"
            title="Address"
            placeholder="0xEB9FB53EC92fe8EBECc480C0b7D7FAcC6603fbad"
            className="address-input"
            required
          />
          <button type="submit" className="submit-button">🔍 Submit</button>
        </div>
      </form>
    </div>
  );
};

export default Form;
