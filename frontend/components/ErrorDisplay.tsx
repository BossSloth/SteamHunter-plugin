import React from 'react';
import { IconsModule } from '@steambrew/client';

interface ErrorDisplayProps {
  errors: Error[];
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ errors }) => (
  <div className="steam-hunters-error-message">
    <IconsModule.ExclamationPoint />
    <p>
      An error occurred:
      <ul>
        {errors.map((error, index) => (
          <li key={index}>{error.message}</li>
        ))}
      </ul>
      Please try again later or create an issue on GitHub with your browser logs/console output attached.
    </p>
  </div>
);
