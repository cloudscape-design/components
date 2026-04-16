import React from 'react';
import { Button, SpaceBetween } from "~components";
import { SimplePage } from "../app/templates";
import './css-style-api.css';

export default function Page() {
    return(
        <SimplePage title="CSS Style API">
            <SpaceBetween size="l">
                <div>
                    <h2>Buttons without icons</h2>
                    <SpaceBetween direction="horizontal" size="s">
                        <Button className="my-normal">Normal</Button>
                        <Button className="my-primary" variant="primary">Primary</Button>
                    </SpaceBetween>
                </div>
                <div>
                    <h2>Buttons with icons</h2>
                    <SpaceBetween direction="horizontal" size="s">
                        <Button className="my-normal" iconName="add-plus">Normal with icon</Button>
                        <Button className="my-primary" variant="primary" iconName="settings">Primary with icon</Button>
                        <Button className="my-link" variant="link" iconName="external" href="#">Link with icon</Button>
                        <Button className="my-icon" variant="icon" iconName="close" ariaLabel="Close" />
                    </SpaceBetween>
                </div>
                <div>
                    <h2>Hover states (hover over buttons)</h2>
                    <SpaceBetween direction="horizontal" size="s">
                        <Button className="my-normal" iconName="add-plus">Normal hover</Button>
                        <Button className="my-primary" variant="primary" iconName="settings">Primary hover</Button>
                        <Button className="my-link" variant="link" iconName="external" href="#">Link hover</Button>
                        <Button className="my-icon" variant="icon" iconName="close" ariaLabel="Close" />
                    </SpaceBetween>
                </div>
                <div>
                    <h2>Disabled states (hover to see bg change)</h2>
                    <SpaceBetween direction="horizontal" size="s">
                        <Button className="my-normal" disabled={true} iconName="add-plus">Disabled normal</Button>
                        <Button className="my-primary" variant="primary" disabled={true} iconName="settings">Disabled primary</Button>
                        <Button className="my-icon" variant="icon" disabled={true} iconName="close" ariaLabel="Close" />
                    </SpaceBetween>
                </div>
                <div>
                    <h2>Focus ring (tab to see)</h2>
                    <SpaceBetween direction="horizontal" size="s">
                        <Button className="my-normal">Default focus</Button>
                        <Button className="my-link" variant="link" href="#">Custom focus ring</Button>
                    </SpaceBetween>
                </div>
            </SpaceBetween>
        </SimplePage>
    );
}
