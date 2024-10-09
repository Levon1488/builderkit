export type Component = {
    className?: string;
}

export type ContainerProps = {
    children: any;
} & Component;

export type IconProps = {
    src: string;
    size?: number;
} & Component;