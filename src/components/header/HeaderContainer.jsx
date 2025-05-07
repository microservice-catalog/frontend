// src/components/Header/HeaderContainer.jsx
import React, {createContext, useCallback, useRef, useState} from 'react'
import {projectTagApi} from '../../api/api.jsx'
import HeaderView from './HeaderView.jsx'
import {useAuth} from '../../context/AuthContext.jsx'
import CreateProjectDialog from '../projects/CreateProjectDialog.jsx'

export const FilterContext = createContext({
    search: '',
    filterTags: []
})

export default function HeaderContainer({children}) {
    const {user, logout, isAuthenticated, loading} = useAuth();

    const [tagOptions, setTagOptions] = useState([]);

    const [search, setSearch] = useState('');
    const [filterTags, setFilterTags] = useState([]);
    const [createOpen, setCreateOpen] = useState(false);
    const cache = useRef({}); // Кеш поиска по тегам. Здесь храним { [query]: [...tags] }

    // Вызывается при каждом вводе в поле тегов
    const fetchTagOptions = useCallback(async (query) => {
        if (cache.current[query]) {
            return cache.current[query];
        }
        try {
            // projectTagApi.searchTags возвращает массив строк (или объектов, если так настроено)
            const {data} = await projectTagApi.searchTags(query);
            cache.current[query] = data.tags;
            setTagOptions(data.tags);
        } catch (err) {
            console.error('Не удалось загрузить теги:', err);
        }
    }, [])

    const onLogout = () => logout();
    const onSearchChange = (value) => setSearch(value);
    const onTagsChange = (tags) => setFilterTags(tags);
    const onCreateProject = () => setCreateOpen(true);
    const onProjectCreated = (dto) => {
        setCreateOpen(false);
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
                tagOptions={tagOptions}
                onTagInputChange={fetchTagOptions}
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
