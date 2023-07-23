import { LightningElement, api } from 'lwc';

export default class SobjTemplatesApp extends LightningElement 
{
    templatesControl;
    templatesViewer;
    templatesReview

    // setup
    renderedCallback()
    {
        this.templatesControl = this.template.querySelector('c-sobj-templates-control');
        this.templatesViewer = this.template.querySelector('c-sobj-templates-viewer');
        this.templatesReview = this.template.querySelector('c-sobj-templates-after-save-review');
    }

    // control to view
    handleGenerated(event)
    {
        new Promise((resolve, rej) => {
            this.templatesViewer.setObj(this.templatesControl.getSelected());
            this.templatesViewer.setFields(JSON.parse(this.templatesControl.getFieldsSelected()));

            resolve();
        })
        .then(() => {this.templatesViewer.loadContainer();})
        .catch((e) => {console.log('Error - ', e.message)});
    }

    // view to save review
    handleSelected(event)
    {
        new Promise((resolve, rej) => {
            this.templatesReview.setObj(this.templatesViewer.getObj());
            this.templatesReview.setFields(this.templatesViewer.getFieldsSaved());

            resolve();
        })
        .then(() => {this.templatesReview.loadContainer();})
        .catch((e) => {console.log('Error - ', e.message)});
    }

    // review back to view
    handleBack(event) { this.templatesViewer.setVisible(true); }
}