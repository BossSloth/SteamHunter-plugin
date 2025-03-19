import { IconsModule } from '@steambrew/client';
import React from 'react';

export function ErrorDisplay({ errors }: {errors: Error[]}): JSX.Element {
  return (
    <div className="steam-hunters-error-message">
      <IconsModule.ExclamationPoint style={{ color: 'crimson', maxWidth: '10%' }} />
      <p>
        An error occurred:
        <ul>
          {errors.map(error => (
            <li key={error.message}>{error.message}</li>
          ))}
        </ul>
        Please try again later or create an issue on GitHub with your browser logs/console output attached.
      </p>
    </div>
  );
}
