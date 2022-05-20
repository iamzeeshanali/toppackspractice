export interface GithubRepository{
    id: number,
    name: string,
    owner: GithubOwner
}

export interface GithubOwner{
    login: string
}

export interface RepositoryCountMap{
    name: string,
    count: number,
}

export interface PackageJSONContents{
    dependencies: Array<any>,
    devDependencies: Array<any>
}

