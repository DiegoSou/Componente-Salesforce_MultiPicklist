import { api, track, LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import callServiceMethod from '@salesforce/apex/SOBJ_TemplatesAdapter.callServiceMethod';

const columns = [{ label: 'Selecionado', fieldName: 'selected', type: 'boolean', initialWidth: 70, editable: true },{ label: 'Nome da coluna na planilha', fieldName: 'label', editable: true },{ label: 'Nome de API do campo', fieldName: 'apiName', editable: false }];

export default class SobjTemplatesAfterSaveReview extends LightningElement
{
    targetObj;    // objeto do template
    savedFields;    // campos salvos: label, apiName, selected

    @track isVisible = false;
    
    data = [];
    columns = columns;

    // public function - seta o objeto alvo
    @api setObj (value) { this.targetObj = value; }

    // public function - seta os campos salvos
    @api setFields (value) { this.savedFields = {}; value.forEach((v) => { this.mapField(v, true) }); }

    // public function - seta visibilidade do componente
    @api setVisible (bool) { this.isVisible = bool; }

    // public function - carrega o componente
    @api loadContainer()
    {
        if(this.isVisible === false) this.isVisible = true;

        this.data = [];

        this.updateData();
    }

    // atualizar os dados de acordo com o mapeamento
    updateData() 
    {
        if(this.template.querySelector('lightning-datatable')?.draftValues?.length > 0)
            this.template.querySelector('lightning-datatable').draftValues.forEach((v) => this.mapField(v, false));

        let tempData = [];
        for (let key in this.savedFields)
        {
            tempData.push(
                {
                    label: this.savedFields[key].label,
                    apiName: this.savedFields[key].apiName,
                    selected: this.savedFields[key].selected
                }
            );
        }

        this.data = tempData;
    }

    // salvar
    callToSave()
    {
        let nameTemplate = this.validateNameInput();

        if(nameTemplate)
        {
            this.updateData();

            callServiceMethod({
                methodName : 'generateImportTemplate',
                methodParams : {
                    name : nameTemplate,
                    arrangeJSON : JSON.stringify({ objSelected : this.targetObj, fieldsSelected : this.data })
                }
            })
            .then(() => this.successSave())
            .catch(() => this.failedSave());
        }
    }

    validateNameInput()
    {
        let inputContainer = this.template.querySelector('div[data-id="inputTemplateName"]').firstElementChild;
        let inputElement = inputContainer.lastElementChild.firstElementChild;

        if(inputElement.value?.replaceAll(' ', '') == '' || inputElement.value?.valueOf() == undefined)
        {
            inputContainer.classList.add('slds-has-error');
            inputElement.ariaInvalid = "true";

            return false;
        }
        else
        {
            inputContainer.classList.remove('slds-has-error');
            inputElement.ariaInvalid = "false";

            return inputElement.value;
        }
    }

    // on save
    successSave() { this.showSuccessToast(); this.backToView(); }
    failedSave() { this.showErrorToast(); console.log(JSON.stringify(error)); }

    // voltar
    backToView() { this.uncheckFields().then(() => { this.isVisible = false; this.dispatchEvent(new CustomEvent('back')); }); }

    // toasts
    showSuccessToast() {
        const evt = new ShowToastEvent({
            title: 'Sucesso',
            message: '',
            variant: 'success',
            mode: 'dismissable'
        });
        this.dispatchEvent(evt);
    }
    showErrorToast() {
        const evt = new ShowToastEvent({
            title: 'Erro',
            message: 'Por favor, contate um administrador do sistema',
            variant: 'error',
            mode: 'dismissable'
        });
        this.dispatchEvent(evt);
    }

    // adicionar campo ao mapeamento
    mapField(draft, checkAll)
    {
        let saved = this.savedFields[draft.apiName];
        
        let getSelected = () => {
            if (checkAll) return true;
            else return (String(draft.selected) !== "undefined") ? draft.selected : saved.selected;
        }

        let tempObj = (
            {
                apiName: draft.apiName,
                label: (String(draft.label) !== "undefined") ? draft.label : saved.label,
                selected: getSelected()
            }
        );

        this.savedFields[draft.apiName] = tempObj;
    }

    // desmarcar campos do mapeamento
    uncheckFields() { return new Promise((res, rej) => { for(let key in this.savedFields) {this.savedFields[key].selected = false;} res(); }); }
}