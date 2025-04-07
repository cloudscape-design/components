import React from 'react';
import { SpaceBetween, TextContent } from '~components';
import Alert from './alert';
import Badge from './badge';
import Button from './button';
import CheckboxField from './checkbox-field';
import Flashbar from './flashbar';
import Input from './input';
import Link from './link';
import Modal from './modal';
import Select from './select';
import Table from './table';
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

  const [
    selectedOption,
    setSelectedOption
  ] = React.useState({ label: "Option 1", value: "1" });

  const [
    selectedItems,
    setSelectedItems
  ] = React.useState([]);

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
          
          <hr />
          
          <TextContent>
            <h3>Select</h3>
          </TextContent>

          <Select
            selectedOption={selectedOption}
            onChange={({ detail }:any) =>
              setSelectedOption(detail.selectedOption)
            }
            options={[
              { label: "Option 1", value: "1" },
              { label: "Option 2", value: "2" },
              { label: "Option 3", value: "3" },
              { label: "Option 4", value: "4" },
              { label: "Option 5", value: "5" }
            ]}
          />

          <hr />
          
          <TextContent>
            <h3>Table</h3>
          </TextContent>

          <Table 
            columnDefinitions={[
              {
                id: "variable",
                header: "Variable name",
                cell: (item:any) => <Link href="#">{item.name}</Link>,
                sortingField: "name",
                isRowHeader: true
              },
              {
                id: "value",
                header: "Text value",
                cell: (item:any) => item.alt,
                sortingField: "alt"
              },
              {
                id: "type",
                header: "Type",
                cell: (item:any) => item.type,
              },
              {
                id: "description",
                header: "Description",
                cell: (item:any) => item.description
              }
            ]}
            columnDisplay={[
              { id: "variable", visible: true },
              { id: "value", visible: true },
              { id: "type", visible: true },
              { id: "description", visible: true }
            ]}
            items={[
              {
                name: "Item 1",
                description: "This is the first item",
                type: "1A",
                size: "Small"
              },
              {
                name: "Item 2",
                alt: "Second",
                description: "This is the second item",
                type: "1B",
                size: "Large"
              },
              {
                name: "Item 3",
                alt: "Third",
                description: "-",
                type: "1A",
                size: "Large"
              },
              {
                name: "Item 4",
                alt: "Fourth",
                description: "This is the fourth item",
                type: "2A",
                size: "Small"
              },
              {
                name: "Item 5",
                alt: "-",
                description:
                  "This is the fifth item with a longer description",
                type: "2A",
                size: "Large"
              },
              {
                name: "Item 6",
                alt: "Sixth",
                description: "This is the sixth item",
                type: "1A",
                size: "Small"
              }
            ]}
            onSelectionChange={({ detail }:any) =>
              setSelectedItems(detail.selectedItems)
            }
            selectedItems={selectedItems}
            selectionType="multi"
            trackBy="name"
            variant="embedded"
          />
        </SpaceBetween>
      </Theme>
    </div>
  );
}
