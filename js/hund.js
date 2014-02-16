;(function(global, $, _, Backbone)
{
    /*** models ***/
    var StateModel = Backbone.Model;
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
    var MenuView = Backbone.View.extend({
        events: {
            'click a': 'onClick'
        }

        , initialize: function()
        {
            this.listenTo(this.model, 'change:state', this.onChangeState);
        }

        , onChangeState: function(model, state)
        {
            this.$('a').removeClass('current');
            this.$('.' + state).addClass('current');
        }
        
        , onClick: function(e)
        {
            this.model.set('state', $(e.currentTarget).data('state'));
            e.preventDefault();
        }
    });

    // content type views
    var TileView = Backbone.View.extend({
        destroy: function()
        {
            this.unbind();
            this.remove();
        }

        , render: function()
        {
            this.options.$appendTo.append(this.options.tileTemplate({
                href: '#'
                , content: this.template(this.model.toJSON())
            }));
        }
    });

    var ImageView = TileView.extend({
        template: _.template('<img src="<%= url %>" alt="<%= title %>" title="<%= description %>" />')

        , events: {
            'click .tile': 'onClick'
        }
        
        , initialize: function(options)
        {
            this.options = _.extend({}, options);
            this.render();
        }

        , onClick: function()
        {
        }
    });

    /*** state handling ***/
    function onStateChange(state)
    {
        destroyViews();

        switch(state)
        {
            default:
                showOverview();
        }
    }

    function destroyViews()
    {
        _.each(views, function(view)
        {
            view.destroy();
        });
    }

    function showOverview()
    {
        images.each(function(model) {
            // jvt: @todo destroy views?
            new ImageView({
                model: model
                , $appendTo: $content
                , tileTemplate: tileTemplate
            });
        });
    }
    
    /*** ***/
    // set up underscore templates to use {{ }}
    var state = new StateModel({ state: 'overview' })
        , tileTemplate = _.template('<a class="tile" href="<%= href %>"><div><%= content %></div></a>')
        , images = new (Backbone.Collection.extend({ model: ImageModel }))
        , $content
        , views = {}
    ;

    function init()
    {
        var data = global.lovelyData;
        if(data.images)
        {
            images.add(data.images);
        }

        $content  = $('#content');

        new MenuView({
            el: '#links'
            , model: state
        });

        // jvt: display initial content
        onStateChange(state.get('state'));
    }
    
    // jvt: run init on document ready
    $(init);
}(window, jQuery, _, Backbone));