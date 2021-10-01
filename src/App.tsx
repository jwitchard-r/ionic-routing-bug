import {
  Link,
  Redirect,
  Route as RRDRoute,
  RouteComponentProps,
  Switch,
  useHistory,
  useRouteMatch
} from 'react-router-dom';
import React, {useEffect, useState} from 'react';
import {IonApp, IonContent, IonPage, IonRouterOutlet} from '@ionic/react';
import {IonReactRouter,} from '@ionic/react-router';
import {createBrowserHistory} from 'history';


/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';


const browserHistory = createBrowserHistory();
const Route = RRDRoute;

function RoutePropsLog(props: RouteComponentProps & { expectedPath?: string }) {
  return <div style={{margin: '3% 1%'}}>
    {
      props.expectedPath && (
        props.match.path !== props.expectedPath
          ? <span style={{color: 'red'}}>expected match.path ({props.match.path}) to equal {props.expectedPath}</span>
          : <span>correct match path</span>
      )
    }
    <br/>
    Match: {JSON.stringify(props.match, null, 2)}
    <br/>
    Location: {JSON.stringify(props.location, null, 2)}
  </div>;
}


const nestedPages = [
  {label: 'Oranges', path: 'oranges'},
  {label: 'Apples', path: 'apples'},
];

// parentPath could come from history but the value is incorrect
function NestedPage(props: { parentPath: string }) {
  const history = {
    ...useHistory(),
    match: useRouteMatch()
  };

  const {
    routes,
    anchors
  } = nestedPages.reduce(({routes, anchors}, tab) => {
    const tabPath = `/*/${tab.path}`;
    routes.push(<Route path={tabPath} key={tabPath} component={RoutePropsLog}/>);

    const fullPath = `${history.match.url}/${tab.path}`;
    const active = history.location.pathname === fullPath;
    anchors.push(
      <Link
        key={tab.path}
        data-active={String(active)}
        style={{
          color: active ? 'blue' : 'black',
          margin: '10px'
        }}
        to={fullPath}
      >
        {tab.label}
      </Link>
    );

    return {routes, anchors};
  }, {routes: Array(), anchors: Array()});

  routes.push(<Redirect key="redirect" from={props.parentPath} to={`${props.parentPath}/${nestedPages[0].path}`}/>);

  return <>
    {anchors}
    <Switch children={routes}/>
  </>;
}

export default function App() {
  const [outletKey, setOutletKey] = useState(false);
  useEffect(() => {
    return browserHistory.listen((location, action) => {
      console.log(action, location);
    });
  }, []);

  let children = [1].map(page => {
    const path = `/page-${page}`;
    return <Route path={path} key={page} render={(routeProps: RouteComponentProps) => {
      return (
        <IonPage>
          <IonContent>
            <div>
              <h4>Page {page}</h4>
              <RoutePropsLog expectedPath={path} {...routeProps}/>
              <NestedPage parentPath={path}/>
            </div>
          </IonContent>
        </IonPage>
      );
    }}/>;
  });

  children.push(<Redirect key="redirect" to="/page-1"/>);

  return (
    <IonApp>
      {
        //@ts-ignore history prop exposed in versions > 5.3
        <IonReactRouter history={browserHistory}>
          <IonRouterOutlet key={String(outletKey)} children={children}/>
          <div style={{color: 'green', position: 'absolute', right: '10%', top: '10%'}} onClick={() => {
            setOutletKey(!outletKey);
          }}>Re-render
          </div>
        </IonReactRouter>
      }
    </IonApp>
  );
}
