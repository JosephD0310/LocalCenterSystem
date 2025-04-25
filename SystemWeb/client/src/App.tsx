import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { publicRoutes } from './routes';
import { Fragment } from 'react/jsx-runtime';
import PrivateRoute from './services/PrivateRoute';

function App() {
    return (
        <Router>
            <Routes>
                {publicRoutes.map((route, index) => {
                    const Layout = route.layout || Fragment;
                    const Page = route.component;
                    const Element = (
                        <Layout>
                            <Page />
                        </Layout>
                    );
                    return (
                        <Route
                            key={index}
                            path={route.path}
                            element={route.isPrivate ? <PrivateRoute>{Element}</PrivateRoute> : Element}
                        />
                    );
                })}
            </Routes>
        </Router>
    );
}

export default App;
