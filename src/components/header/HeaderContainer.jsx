// src/components/Header/HeaderContainer.jsx
import React, {createContext, useEffect, useState} from 'react';
import HeaderView from './HeaderView.jsx';
import {useAuth} from '../../context/AuthContext.jsx';
import {projectApi} from '../../api/api.jsx';
import CreateProjectDialog from '../projects/CreateProjectDialog.jsx';

// Контекст для поиска и фильтрации
export const FilterContext = createContext({
    search: '',
    filterTags: []
});

export default function HeaderContainer({children}) {
    const {user, logout, isAuthenticated, loading} = useAuth();

    const [allTags, setAllTags] = useState([]);
    const [search, setSearch] = useState('');
    const [filterTags, setFilterTags] = useState([]);
    const [createOpen, setCreateOpen] = useState(false);

    const onLogout = () => {
        logout();
    }

    // загрузка всех тегов
    useEffect(() => {
        (async () => {
            try {
                const res = await projectApi.getProjects({page: 0, limit: 100});
                const tagsSet = new Set();
                res.data.content.forEach(p => p.tags.forEach(t => tagsSet.add(t))); // todo получение тегов по запросу
                setAllTags([...tagsSet]);
            } catch (err) {
                console.error(err);
            }
        })();
    }, []);

    const onSearchChange = (value) => setSearch(value);
    const onTagsChange = (tags) => setFilterTags(tags);
    const onCreateProject = () => setCreateOpen(true);
    const onProjectCreated = (dto) => {
        setCreateOpen(false);
        // переходим на страницу редактирования новой записи
        window.location.href = `/${user.username}/${dto.projectName}`;
    };

    return (
        <FilterContext.Provider value={{search, filterTags}}>
            <HeaderView
                avatarUrl={user?.avatarUrl}
                username={user?.username}
                isAuthenticated={isAuthenticated}
                onLogout={onLogout}
                loading={loading}
                allTags={allTags}
                onSearchChange={onSearchChange}
                onTagsChange={onTagsChange}
                onCreateProject={onCreateProject}
            />
            <CreateProjectDialog
                open={createOpen}
                onClose={() => setCreateOpen(false)}
                onCreated={onProjectCreated}
                username={user?.username}
            />
            {children}
        </FilterContext.Provider>
    );
}
