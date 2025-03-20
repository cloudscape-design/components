import React from 'react';
import { SpaceBetween, TextContent } from '~components';
import Alert from './alert';
import Badge from './badge';
import Button from './button';
import CheckboxField from './checkbox-field';
import Flashbar from './flashbar';
import Input from './input';
import Modal from './modal';
import { fontFamily, palette } from './theme';
import Theme from '~components/theming/component';
import styles from './styles.scss';

export default function AmplifyDemo() {
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  
  const [flashbarItems, setFlashbarItems]:any = React.useState([
    {
      type: "success",
      dismissible: true,
      dismissLabel: "Dismiss message",
      content: "This is a success flash message",
      id: "message_5",
      onDismiss: () =>
        setFlashbarItems((items:any) =>
          items.filter((item:any) => item.id !== "message_5")
        )
    },
    {
      type: "warning",
      dismissible: true,
      dismissLabel: "Dismiss message",
      content: "This is a warning flash message",
      id: "message_4",
      onDismiss: () =>
        setFlashbarItems((items:any) =>
          items.filter((item:any) => item.id !== "message_4")
        )
    },
    {
      type: "error",
      dismissible: true,
      dismissLabel: "Dismiss message",
      header: "Failed to update instance id-4890f893e",
      content: "This is a dismissible error message",
      id: "message_3",
      onDismiss: () =>
        setFlashbarItems((items:any) =>
          items.filter((item:any) => item.id !== "message_3")
        )
    },
    {
      type: "info",
      dismissible: true,
      dismissLabel: "Dismiss message",
      content: "This is an info flash message",
      id: "message_2",
      onDismiss: () =>
        setFlashbarItems((items:any) =>
          items.filter((item:any) => item.id !== "message_2")
        )
    },
  ]);

  return (
    <div className={styles.amplify}>
      <Theme 
        fontFamily={fontFamily} 
        outline={palette.neutral90}
        onDarkMode={{
          outline: palette.neutral10
        }}
      >
        <SpaceBetween direction='vertical' size='m'>
          <TextContent>
            <h3>Alert</h3>
          </TextContent>

          <Alert heading="Alert heading" variation="default">
            This is the alert message
          </Alert>

          <Alert heading="Alert heading" variation="info">
            This is the alert message
          </Alert>

          <Alert heading="Alert heading" variation="error">
            This is the alert message
          </Alert>

          <Alert heading="Alert heading" variation="warning">
            This is the alert message
          </Alert>

          <Alert heading="Alert heading" variation="success">
            This is the alert message
          </Alert>

          <hr />

          <TextContent>
            <h3>Badge</h3>
          </TextContent>

          <Badge variation="default">Badge</Badge>
          <Badge variation="info">Badge</Badge>
          <Badge variation="error">Badge</Badge>
          <Badge variation="warning">Badge</Badge>
          <Badge variation="success">Badge</Badge>

          <hr />

          <TextContent>
            <h3>Button</h3>
          </TextContent>


          <Button colorTheme="default" variation="primary">Default</Button>
          <Button colorTheme="success" variation="primary">Success</Button>
          <Button colorTheme="error" variation="primary">Error</Button>
          <Button colorTheme="info" variation="primary">Info</Button>
          <Button colorTheme="warning" variation="primary">Warning</Button>
          <Button colorTheme="success" variation="primary" isDisabled>isDisabled</Button>
          <Button colorTheme="success" variation="primary" isLoading>isLoading</Button>

          <hr />

          <TextContent>
            <h3>Checkbox Field</h3>
          </TextContent>

          <CheckboxField checked={true} label="Subscribe" />
          <CheckboxField checked={true} isDisabled label="Subscribe" />
          <CheckboxField checked={true} isIndeterminate label="Subscribe" />
          <CheckboxField checked={true} isIndeterminate isDisabled label="Subscribe" />
          <CheckboxField checked={false} label="Subscribe" />
          <CheckboxField checked={false} isDisabled label="Subscribe" />

          <hr />

          <TextContent>
            <h3>Input</h3>
          </TextContent>

          <Input value="Bilbo Baggins" />
          <Input placeholder="Baggins" />
          <Input value="Bilbo Baggins" isDisabled />
          <Input placeholder="Baggins" isDisabled />

          <hr />

          <TextContent>
            <h3>Modal</h3>
          </TextContent>

          <Button 
            colorTheme="default" 
            onClick={() => setIsModalVisible(true)}
            variation="primary"
          >
            Open Modal
          </Button>

          <Modal
            footer={<span>Modal footer.</span>}
            onDismiss={() => setIsModalVisible(false)}
            visible={isModalVisible}
            header="Modal title"
          >
            <p style={{margin: 0}}>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quo magnam 
              eligendi magni accusamus quidem autem soluta quas minus a. Omnis, id 
              reprehenderit quis voluptatibus ea ab illo dolores dolore nostrum.
            </p>

            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quo magnam 
              eligendi magni accusamus quidem autem soluta quas minus a. Omnis, id 
              reprehenderit quis voluptatibus ea ab illo dolores dolore nostrum.
            </p>
          </Modal>

          <hr />

          <TextContent>
            <h3>Flashbar</h3>
          </TextContent>

          <Flashbar
            items={flashbarItems}
            stackItems={true}
          />
        </SpaceBetween>
      </Theme>
    </div>
  );
}
