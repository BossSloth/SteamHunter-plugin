import React, { useState } from 'react';
import {
  Button,
  ButtonItem,
  Field,
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [sliderValue, setSliderValue] = useState(50);
  const [textValue, setTextValue] = useState('');
  const [toggleValue, setToggleValue] = useState(false);

  const menuItems = ['Profile', 'Inventory', 'Store', 'Community', 'Settings'];
  const carouselItems = ['Item 1', 'Item 2', 'Item 3'].map((text) => (
    <div key={text} style={{ padding: '20px', background: '#1a1a1a' }}>{text}</div>
  ));

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
{/*
      <section style={{ marginBottom: '40px' }}>
        <h2>Navigation & Controls</h2>
        <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
          <div style={{ width: '200px' }}>
            <SidebarNavigation>
              {menuItems.map((item) => (
                <div key={item}>{item}</div>
              ))}
            </SidebarNavigation>
          </div>
          <div style={{ width: '200px' }}>
            <Menu label='Menu'>
              {menuItems.map((item) => (
                <div key={item}>{item}</div>
              ))}
            </Menu>
          </div>
        </div>
      </section> */}

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
          {/* <SliderField
            showValue
            editableValue
            label="Slider Field"
            value={sliderValue}
            min={0}
            max={100}
            onChange={setSliderValue}
          /> */}
          <Field label="Toggle Field">
            <Toggle value={toggleValue} onChange={setToggleValue} />
          </Field>
          {/* <DialogCheckbox
            label="Dialog Checkbox"
            checked={toggleValue}
            onChange={setToggleValue}
          /> */}
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

      {/* <FooterLegend>
        <div>Footer content goes here</div>
      </FooterLegend> */}
    </div>
  );
};