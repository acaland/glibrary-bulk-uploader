//Ext.Loader.setConfig({ enabled: true });
Ext.Loader.setPath({
    'Ext.ux.upload' : './extjs-upload-widget/lib/upload'
});

Ext.define('Uploader.Configs', {
    singleton: true,
    repository: 'Sitar',
    vo: 'vo.dch-rp.eu',
    defaultSE: 'prod-se-03.ct.infn.it',
    defaultSEPath: '/dpm/ct.infn.it/home/vo.dch-rp.eu/sitar'
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
    }
});