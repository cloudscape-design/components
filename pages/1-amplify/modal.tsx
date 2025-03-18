import React from 'react';
import { Modal as CloudscapeModal } from '~components';
import { fontFamily, palette } from './theme';

export default function Modal(props: any) {
  return (
    <CloudscapeModal
      footer={props.footer}
      header={props.header}
      onDismiss={props.onDismiss}
      theme={{
        backdrop: {
          backgroundColor: 'rgba(101, 108, 133, 0.8)',
        },
        container: {
          backgroundColor: palette.white,
          borderRadius: '8px',
          borderColor: palette.neutral40,
          fontFamily: fontFamily,
        }
      }}
      visible={props.visible}
    >
      {props.children}
    </CloudscapeModal>
  );
}
