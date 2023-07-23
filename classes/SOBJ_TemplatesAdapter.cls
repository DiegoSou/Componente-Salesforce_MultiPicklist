public virtual without sharing class SOBJ_TemplatesAdapter 
{
    private static Map<String, String> serviceMethodToClassMethod = new Map<String,String>
    {
        'getOrgObjects' => 'SOBJ_TemplatesAdapter.ADP_OrgObjects',
        'getFieldsFromObject' => 'SOBJ_TemplatesAdapter.ADP_FieldsFromObject',
        'generateImportTemplate' => 'SOBJ_TemplatesAdapter.ADP_GenerateTemplate'
    };

    public class ADP_OrgObjects extends ClassMethod
    {
        public override ClassMethod callMethod(Map<String, Object> methodParams)
        {
            this.methodResponse = instanceSOBJ_TemplatesService.orgObjects();
            return this;
        }
    }

    public class ADP_FieldsFromObject extends ClassMethod
    {
        public override ClassMethod callMethod(Map<String, Object> methodParams)
        {
            this.methodResponse = instanceSOBJ_TemplatesService.fieldsFromObject((String) methodParams.get('selectedObject'));
            return this;
        }
    }

    public class ADP_GenerateTemplate extends ClassMethod
    {
        public override ClassMethod callMethod(Map<String, Object> methodParams)
        {
            instanceSOBJ_TemplatesService.generateObjectTemplate((String) methodParams.get('name'), (String) methodParams.get('arrangeJSON'));
            return this;
        }
    }

    // Instancias
    private static SOBJ_ITemplatesService instanceSOBJ_TemplatesService
    {
        get 
        {
            if(instanceSOBJ_TemplatesService == null) 
            {
                instanceSOBJ_TemplatesService = (SOBJ_ITemplatesService) Type.forName('SOBJ_TemplatesService').newInstance(); 
            }

            return instanceSOBJ_TemplatesService;
        }
        set;
    }

    // Call service
    @AuraEnabled
    public static String callServiceMethod(String methodName, Map<String, Object> methodParams) 
    {
        if(!serviceMethodToClassMethod.containsKey(methodName)) { throw new SOBJ_TemplatesAdapterException('Método não definido - ' + methodName); }

        return (
            (ClassMethod) Type.forName(serviceMethodToClassMethod.get(methodName))
            .newInstance()
        )
        .callMethod(methodParams)
        .methodResponse;
    }

    // Class method
    public class SOBJ_TemplatesAdapterException extends Exception {}
    public abstract class ClassMethod 
    { 
        public String methodResponse { get{ return methodResponse == null ? '' : methodResponse; } protected set; }
        public abstract ClassMethod callMethod(Map<String, Object> methodParams); 
    }
}