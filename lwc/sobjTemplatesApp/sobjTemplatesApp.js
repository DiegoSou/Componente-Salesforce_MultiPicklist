import { LightningElement, api } from 'lwc';

export default class SobjTemplatesApp extends LightningElement 
{
    templatesControl;
    templatesViewer;

    renderedCallback()
    {
        this.templatesControl = this.template.querySelector('c-sobj-templates-control');
        this.templatesViewer = this.template.querySelector('c-sobj-templates-viewer');
    }

    handleSelected(event)
    {
        this.templatesViewer.setObj(this.templatesControl.getSelected());
        this.templatesViewer.setFields(JSON.parse(this.templatesControl.getFieldsSelected()));
        
        this.templatesViewer.loadContainer();
    }
}