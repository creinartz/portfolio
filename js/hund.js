;(function(global, $, _, Backbone)
{
    /*** models ***/
    var ImageModel = Backbone.Model.extend({
        defaults: {
            url: ''
            , thumbUrl: ''
            , category: ''
            , title: ''
            , description: ''
        }
    });
    
    /*** views ***/
    var MainView = Backbone.View.extend({
        events: {
            'click .tile': 'onClick'
        }
        
        , initialize: function(options)
        {
            this.options = _.extend({
                el: '#'
            }, options);
            
            this.listenTo(this.collection)
        }
    });
    
    /*** ***/
    _.templateSettings = { interpolate: /\{\{(.+?)\}\}/g };
    var tileTemplate = _.template('<a class="tile" href="{{ href }}"><div>{{ content }}</div></a>')
        , images = new (Backbone.Collection.extend({ model: ImageModel }))
    ;
    
    function init()
    {
        
        var data = global.lovelyData;
        console.debug('init!', data);
        if(data.images)
        {
            images.add(data.images);
        }
    }
    
    // jvt: run init on document ready
    $(init);
}(window, jQuery, _, Backbone));