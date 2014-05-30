//Ext.Loader.setConfig({ enabled: true });
Ext.Loader.setPath({
    'Ext.ux.upload' : './extjs-upload-widget/lib/upload'
});



Ext.application({
    name: 'Uploader',
    //models: ['TypesTree'],
    stores: ['TypesTree', 'FileList'],
    controllers: ['Main', 'TypesTree'],
    requires: ['Uploader.view.Viewport'],
    //autoCreateViewport: true,
    launch: function() {
    	Ext.create('Uploader.view.Viewport');
        console.log("loaded");
        //this.getTypesTreeStore().load();
    },
    repository: 'aginfra'

});