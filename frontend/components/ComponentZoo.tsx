import React, { Component, useState } from 'react';
import {
  Button,
  ButtonItem,
  Field,
  IconsModule,
  PanelSection,
//   Modal,
//   Panel,
  ProgressBar,
  ScrollPanel,
Spinner,
  SteamSpinner,
  TextField,
  Toggle,
} from '@steambrew/client';

export const ComponentZoo: React.FC = () => {
  const [textValue, setTextValue] = useState('');
  const [toggleValue, setToggleValue] = useState(false);

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Steam Components Zoo</h1>

      <section style={{ marginBottom: '40px' }}>
        <h2>Buttons & Items</h2>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <Button onClick={() => console.log('clicked')}>Regular Button</Button>
          <ButtonItem>Button Item</ButtonItem>
          {/* <Item>Regular Item</Item> */}
        </div>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2>Loading Indicators</h2>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <Spinner />
          <SteamSpinner />
          <ProgressBar nProgress={75} />
        </div>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2>Form Controls</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px' }}>
          <Field label="Text Field">
            <TextField
              value={textValue}
              onChange={(e) => setTextValue(e.target.value)}
              placeholder="Enter text..."
            />
          </Field>
          <Field label="Toggle Field">
            <Toggle value={toggleValue} onChange={setToggleValue} />
          </Field>
        </div>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2>Containers & Layout</h2>
        <PanelSection>
          <h3>Panel Content</h3>
          <p>This is a panel component that can contain other elements.</p>
        </PanelSection>
        
        <ScrollPanel>
          <div style={{ padding: '20px' }}>
            <p>Scrollable content goes here...</p>
            <p>More content to demonstrate scrolling...</p>
            <p>Even more content...</p>
          </div>
        </ScrollPanel>
      </section>

      <section>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {Object.entries(IconsModule).map(([name, Icon]: [string, any]) => (
            <div key={name} style={{ textAlign: 'center', width: '100px' }}>
              <Icon width={100}/>
              <div>{name}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};