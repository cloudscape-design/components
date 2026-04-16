import React from 'react';
import { Button } from "~components";
import { SimplePage } from "../app/templates";
import './css-style-api.css';

export default function Page() {
    return(
        <SimplePage title="CSS Style API">
            <h2>Buttons without icons</h2>
            <Button className="my-normal">Normal</Button>
            <Button className="my-primary" variant="primary">Primary</Button>

            <h2>Buttons with icons</h2>
            <Button className="my-normal" iconName="add-plus">Normal with icon</Button>
            <Button className="my-primary" variant="primary" iconName="settings">Primary with icon</Button>
            <Button className="my-link" variant="link" iconName="external" href="#">Link with icon</Button>
            <Button className="my-icon" variant="icon" iconName="close" ariaLabel="Close" />
        </SimplePage>
    );
}
