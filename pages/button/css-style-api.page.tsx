import React from 'react';
import { Button } from "~components";
import { SimplePage } from "../app/templates";
import './css-style-api.css';

export default function Page() {
    return(
        <SimplePage title="CSS Style API">
            <h2>Buttons without icons</h2>
            <Button>Normal</Button>
            <Button variant="primary">Primary</Button>

            <h2>Buttons with icons</h2>
            <Button iconName="add-plus">Normal with icon</Button>
            <Button variant="primary" iconName="settings">Primary with icon</Button>
            <Button variant="link" iconName="external">Link with icon</Button>
            <Button variant="icon" iconName="close" ariaLabel="Close" />
        </SimplePage>
    );
}
