@isTest
public class SOBJ_TemplatesTest 
{
    // setup method
    public static String constructArrangeJSON()
    {
        SOBJ_TemplatesService.SOBJ_TemplatesFieldSelectedWrapper templateFieldW = new SOBJ_TemplatesService.SOBJ_TemplatesFieldSelectedWrapper();
        templateFieldW.label = 'nome';
        templateFieldW.apiName = 'Name';
        templateFieldW.selected = true;
        
        
        SOBJ_TemplatesService.SOBJ_TemplatesObjectWrapper templateObjW = new SOBJ_TemplatesService.SOBJ_TemplatesObjectWrapper();
        templateObjW.objSelected = 'Account';
        templateObjW.fieldsSelected = new List<SOBJ_TemplatesService.SOBJ_TemplatesFieldSelectedWrapper> {
            templateFieldW
        };
            
        return JSON.serialize(templateObjW);
    }
    
    @isTest
    static void coverage()
    {
        // GIVEN
        Map<String, Object> getOrgObjectsParams = new Map<String, Object>{};
        Map<String, Object> getFieldsFromObjectParams = new Map<String, Object>{ 'selectedObject' => 'Account' };
        Map<String, Object> generateImportTemplateParams = new Map<String, Object>{ 'name' => 'testemplate', 'arrangeJSON' => constructArrangeJSON() };

        // WHEN
        SOBJ_TemplatesAdapter.callServiceMethod('getOrgObjects', getOrgObjectsParams);
        SOBJ_TemplatesAdapter.callServiceMethod('getFieldsFromObject', getFieldsFromObjectParams);
        SOBJ_TemplatesAdapter.callServiceMethod('generateImportTemplate', generateImportTemplateParams);

        // THEN
    }
}